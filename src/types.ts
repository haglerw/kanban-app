export interface ITask {
  id: string;
  name: string;
}

export interface IColumn {
  id: string;
  name: string;
  tasks: ITask[];
}
