import React from 'react';
import { Task } from '../../types';

/**
 * Task item in sprint view
 * @visibleName Task Item
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className='task-item'>
      <div>
        <p>{task.name}</p>
        <p>{`Estimated Hours: ${task.estimatedHours}h`}</p>
        <p>{`Subtasks Completed: ${task.subtasks.filter((st) => st.status).length}/${task.subtasks.length}`}</p>
        <p>{`Assigned to: `}</p>
      </div>
    </div>
  );
};

export default TaskItem;

interface TaskItemProps {
  /** Task to be displayed */
  task: Task
}