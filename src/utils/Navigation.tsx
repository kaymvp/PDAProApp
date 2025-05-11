// This class is for routing
export type RootStackParamList = {
    Launch: undefined;
    Dashboard: undefined;
    Chat: {
      userId: string;
      childId: string;
    };
  };

  // This gives you type checking for screen names and their params
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
