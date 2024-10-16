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
}
