import { Extension } from '@tiptap/core';
import { liftListItem, sinkListItem } from 'prosemirror-schema-list';

const IndentExtension = Extension.create({
  name: 'indent',

  addCommands() {
    return {
      indent: () => ({ commands }) => {
        return commands.command((state, dispatch) => {
          const { tr } = state;
          const result = sinkListItem('listItem')(state, dispatch);
          if (result) {
            dispatch(tr);
          }
          return result;
        });
      },
      outdent: () => ({ commands }) => {
        return commands.command((state, dispatch) => {
          const { tr } = state;
          const result = liftListItem('listItem')(state, dispatch);
          if (result) {
            dispatch(tr);
          }
          return result;
        });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Ctrl-]': () => this.editor.commands.indent(),
      'Ctrl-[': () => this.editor.commands.outdent(),
    };
  },
});

export default IndentExtension;
