import * as Interfaces from './interfaces';

export const ServerOptions: Interfaces.SelectOption[] = [
  {
    id: `remote`,
    value: `//68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud`,
    hint: `Remote server`,
  },
  {
    id: `localhost`,
    value: `http://localhost:13337/`,
    hint: `Local server`,
  },
];

export const RemoteServerURL = ServerOptions[0].value;
