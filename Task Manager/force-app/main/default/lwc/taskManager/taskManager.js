import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTaskList from '@salesforce/apex/TaskController.getTasks';

export default class TaskManager extends LightningElement {
    tasks;
    error;
    showForm = false;
    selectedTaskId;
    taskToEdit = null;
    hasNoTask = false;
    isDelete = false;
    // Task columns
    columns = [
        { label: 'Subject', fieldName: 'Subject' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Priority', fieldName: 'Priority', type: 'text' },
        { label: 'Due Date', fieldName: 'ActivityDate', type: 'date' },
        {
            type: 'button', typeAttributes: {
                label: 'Complete',
                name: 'complete',
                variant: 'success'
            }
        },
        {
            type: 'button', typeAttributes: {
                label: 'Delete',
                name: 'delete',
                variant: 'destructive'
            }
        }
    ];

    // Fetch task list from the server
    @wire(getTaskList)
    wiredTasks(result) {
        this.tasks = result;
        if(result.data && result.data.length === 0) {
            this.hasNoTask = true;
        } else if (result.error) {
            this.error = result.error;
            this.tasks = undefined;
        }
    }

    // Toggle form visibility for creating a new task
    toggleFormVisibility() {
        this.showForm = true;
        //this.taskToEdit = null;
    }

    deleteRecord() {
        var el = this.template.querySelector('lightning-datatable');
        console.log(el);
        var selected = el.getSelectedRows();
        console.log(selected);
        this.isDelete = true;
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            // set behavior after a finished flow interview
            this.showToast('Task Created', 'Task has been created successfully', 'success');
            this.showForm = false; // Hide the form
            refreshApex(this.tasks); // Refresh the task list
        }
    }
    

    // Handle row actions (Complete or Delete)
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'complete') {
            this.updateTaskStatus(row.Id, 'Completed');
        } else if (actionName === 'delete') {
            this.deleteTask(row.Id);
        }
    }

    // Complete the task by updating its status
    updateTaskStatus(taskId, status) {
        // set flow input variables
    }

    
    deleteTask(taskId) {
        // set flow input variables
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
