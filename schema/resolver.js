const Caption = require('../models/Caption');

module.exports = {
  Query: {
    captions: async () => await Caption.find(),
  },
  Mutation: {
    triggerCaption: async (_, args, { pubsub }) => {
      const newCaption = new Caption(args);
      const savedCaption = await newCaption.save();
      pubsub.publish('CAPTION_TRIGGERED', { captionTriggered: savedCaption });
      return savedCaption;
    },
    hideCaption: async (_, __, { pubsub }) => {
      pubsub.publish('CAPTION_HIDDEN', { captionHidden: 'hide' });
      return 'Caption hidden';
    },
  },
  Subscription: {
    captionTriggered: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator(['CAPTION_TRIGGERED']);
      },
    },
    captionHidden: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['CAPTION_HIDDEN']),
    },
  },
};
