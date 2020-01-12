import React from 'react';
import { Task } from '../../types';
import { connect } from 'react-redux';
import { setShownTask } from '../../redux/actions';

/**
 * Task item in sprint view
 * @visibleName Task Item
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const TaskItem: React.FC<TaskItemProps> = ({ task, setShownTask }) => {
  return (
    <div className='task-item' onClick={() => setShownTask(task)}>
      <div>
        <p>{task.name}</p>
        <p>{`Estimated Hours: ${task.estimatedHours}h`}</p>
        <p>{`Subtasks Completed: ${task.subtasks.filter((st) => st.status).length}/${task.subtasks.length}`}</p>
        <p>{`Assigned to: ${task.user ? task.user.fullName : 'Not Assigned'}`}</p>
      </div>
    </div>
  );
};

export default connect(null, { setShownTask })(TaskItem);

interface TaskItemProps {
  /** Task to be displayed */
  task: Task
  /** Method to change the task that will be displayed in task view */
  setShownTask: Function
}