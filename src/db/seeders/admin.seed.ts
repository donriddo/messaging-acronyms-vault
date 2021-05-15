import { UserTypes } from '../../components/users/UserModel';
import UserService from '../../components/users/UserService';

export default async function seedAcronyms() {
  try {
    let admin = await UserService.findOne({
      email: 'chinedu@trybrij.com',
    });

    if (!admin) {
      admin = await UserService.createOne({
        email: 'chinedu@trybrij.com',
        password: 'password!',
        type: `${UserTypes.admin}`,
      });
    }

    return admin;
  } catch (error) {
    console.log('Error seeding acronyms: ', error);
  }
}
