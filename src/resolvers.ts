import { v4 as uuid } from 'uuid';
import { recognitions, Recognition } from './data';
import { PUBSUB, EVENTS } from './pubsub';
import { User } from './auth';

export const resolvers = {
  Query: {
    allRecognitions: (
      _parent: any,
      _args: any,
      { user }: { user: User }
    ): Recognition[] => {
      return recognitions.filter(r =>
        r.visibility === 'PUBLIC' ||
        (r.visibility === 'PRIVATE' && r.to === user.id) ||
        user.role === 'ADMIN'
      );
    },

    recognitionsByTeam: (
      _parent: any,
      { team }: { team: string }
    ): Recognition[] => {
      return recognitions.filter(r => r.team === team);
    }
  },

  Mutation: {
    addRecognition: (
      _parent: any,
      args: Omit<Recognition, 'id' | 'createdAt' | 'from'>,
      { user }: { user: User }
    ): Recognition => {
      const newRec: Recognition = {
        ...args,
        id: uuid(),
        from: user.id,
        createdAt: new Date().toISOString()
      };
      recognitions.push(newRec);
      PUBSUB.publish(EVENTS.RECOGNITION_ADDED, {
        recognitionAdded: newRec
      });
      return newRec;
    }
  },

  Subscription: {
    recognitionAdded: {
      // cast PUBSUB to any so TS knows asyncIterator exists at runtime
      subscribe: (): AsyncIterator<Recognition> =>
        (PUBSUB as any).asyncIterator(EVENTS.RECOGNITION_ADDED)
    }
  }
};
