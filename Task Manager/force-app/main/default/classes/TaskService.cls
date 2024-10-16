public inherited sharing class TaskService {
    public static List<Id> deleteTasks(List<Id> taskIds) {
        List<Id> failedTaskIds = new List<Id>();
        Database.DeleteResult[] deleteResults = Database.delete(taskIds, false, AccessLevel.USER_MODE);
        // Iterate through each returned result
        for(Database.DeleteResult dr : deleteResults) {
            if (!dr.isSuccess()) {
                failedTaskIds.add(dr.getId());
                // Operation failed, so get all errors                
                for(Database.Error err : dr.getErrors()) {
                    //TODO: Logging Error
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }
        return failedTaskIds;
    }

    public static List<Id> updateTaskStatus(List<Id> taskIds) {
        List<Id> failedTaskIds = new List<Id>();

        List<Task> tasksToUpdate = [SELECT Id, Status FROM Task WHERE Id IN: taskIds];
        for(Task task: tasksToUpdate) {
            task.Status = 'Completed';
        }
        
        Database.SaveResult[] updateResults = Database.update(tasksToUpdate, false, AccessLevel.USER_MODE);
        
        // Iterate through each returned result
        for(Database.SaveResult sr : updateResults) {
            if (!sr.isSuccess()) {
                failedTaskIds.add(sr.getId());
                // Operation failed, so get all errors                
                for(Database.Error err : sr.getErrors()) {
                    //TODO: Logging Error
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }
        return failedTaskIds;
    }
}