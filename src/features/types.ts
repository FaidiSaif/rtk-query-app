export type UserType = {
  id: number;
  name: string;
};

export type StateType = {
  api: UserType[];
};

export type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
  date?: any; 
  reactions? :any
};
