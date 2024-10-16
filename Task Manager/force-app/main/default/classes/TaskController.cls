public with sharing class TaskController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks() {
        return [
            SELECT Id, Subject, Status, Priority, ActivityDate, Description
            FROM Task
            WHERE OwnerId = :UserInfo.getUserId()
            ORDER BY ActivityDate ASC
            LIMIT 100
        ];
    }
    @AuraEnabled
    public static List<Id> deleteTasks(List<Id> taskIds) {
        return TaskService.deleteTasks(taskIds);
    }
    @AuraEnabled
    public static List<Id> updateTasks(List<Id> taskIds) {
        return TaskService.updateTaskStatus(taskIds);
    }


    
}
