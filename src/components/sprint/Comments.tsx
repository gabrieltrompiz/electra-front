import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { TaskComment, State } from 'electra';

/**
 * Comments section in task view
 * @visibleName Subtasks
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Comments: React.RefForwardingComponent<HTMLDivElement ,CommentsProps> = ({ comments }, ref) => {
  return (
    <div id='comments' ref={ref}>
      {comments.length === 0 && <div id='no-comments'>No comments published in this task.</div>}
      {comments.map((c) => (
        <div key={c.id}>
          <img src={c.user.pictureUrl} alt='avatar' />
          <div>
            <p>{c.user.fullName}</p>
            <p>{c.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer } = state;
  return {
    comments: settingsReducer.show.task.comments
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef<HTMLDivElement, CommentsProps>(Comments));

interface CommentsProps {
  /** Array of comments */
  comments: TaskComment[]
}
