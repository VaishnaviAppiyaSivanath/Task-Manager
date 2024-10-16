import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTaskList from '@salesforce/apex/TaskController.getTasks';
import deleteTasks from '@salesforce/apex/TaskController.deleteTasks';
import updateTaskStatus from '@salesforce/apex/TaskController.updateTasks';

export default class TaskManager extends LightningElement {
    tasks;
    error;
    showForm = false;
    selectedTaskId;
    taskToEdit = null;
    hasNoTask = false;
    isDelete = false;
    taskIds = [];
    // Task columns
    columns = [
        { label: 'Subject', fieldName: 'Subject' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Priority', fieldName: 'Priority', type: 'text' },
        { label: 'Due Date', fieldName: 'ActivityDate', type: 'date' }
    ];

    // Fetch task list from the server
    @wire(getTaskList)
    wiredTasks(result) {
        this.tasks = result;
        if(result.data && result.data.length === 0) {
            this.hasNoTask = true;
        } else if (result.error) {
            this.error = result.error;
            console.error(result.error);
        }
    }

    // Toggle form visibility for creating a new task
    createTask() {
        this.showForm = true;
    }

    deleteRecord() {
        var el = this.template.querySelector('lightning-datatable');
        
        var selectedRows = el.getSelectedRows();
        
        selectedRows.forEach((record) => {this.taskIds.push(record.Id)});
        
        this.isDelete = true;
        deleteTasks({taskIds: this.taskIds})
        .then((result) => {
            this.showToast('Task Deleted', 'Task has been deleted successfully', 'success');
            refreshApex(this.tasks); // Refresh the task list
        })
        .catch(error => {
            console.error(error);
        })
            
    }
    
    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            // set behavior after a finished flow interview
            this.showToast('Task Created', 'Task has been created successfully', 'success');
            refreshApex(this.tasks); // Refresh the task list
            this.showForm = false; // Hide the form
            this.hasNoTask = false;
        }
    }

    // Complete the task by updating its status
    markComplete() {
        var el = this.template.querySelector('lightning-datatable');
        var selectedRows = el.getSelectedRows();
        selectedRows.forEach((record) => {this.taskIds.push(record.Id)});
        updateTaskStatus({taskIds: this.taskIds})
        .then((result) => {
            this.showToast('Task Updated', 'Task has been updated successfully', 'success');
            refreshApex(this.tasks); // Refresh the task list
        })
        .catch(error => {
            console.error(error);
        })
    }

    getSelectedRowIds() {
        var selectedIds = [];
        var el = this.template.querySelector('lightning-datatable');
        var selectedRows = el.getSelectedRows();
        selectedRows.forEach((record) => {this.selectedIds.push(record.Id)});
        return selectedIds;
    }
    // Show toast notifications
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
