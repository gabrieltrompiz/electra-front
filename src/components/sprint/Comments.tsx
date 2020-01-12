import React from 'react';
import { connect } from 'react-redux';
import { TaskComment, State } from '../../types';

/**
 * Comments section in task view
 * @visibleName Subtasks
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Comments: React.FC<CommentsProps> = ({ comments }) => {
  return (
    <div id='comments'>
      {comments.length === 0 && <div id='no-comments'>No comments published in this task.</div>}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer } = state;
  return {
    comments: settingsReducer.show.task.comments
  };
};

export default connect(mapStateToProps)(Comments);

interface CommentsProps {
  /** Array of comments */
  comments: TaskComment[]
}
