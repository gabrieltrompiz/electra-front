import React from 'react';
import { Task as TaskI } from '../types';

/**
 * Active task view
 * @visibleName Task View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Task: React.FC<TaskProps> = ({ task }) => {
  return (
    <div id='task'>

    </div>
  );
};

export default Task;

interface TaskProps {
  /** task to be displayed */
  task: TaskI
}