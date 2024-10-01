import getApiDocker from '@/api/apiDocker';
import api from '../api/api'
import { usersFake } from '../dataFake/data';
import type { ICredential } from '../interfaces/IUser';

export default {

  async login(credentials: ICredential) {
    const apiDocker = await getApiDocker();
  const formattedCredentials = new URLSearchParams();
  formattedCredentials.append('username', credentials.username);
  formattedCredentials.append('password', credentials.password);
  const response = await apiDocker.post('login', formattedCredentials.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });  
  return response;
  }
  ,

  async logout() {
    const apiDocker = await getApiDocker();  
    const response = await apiDocker.get('logout');
    return response;
  }
}


