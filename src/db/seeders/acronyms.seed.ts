import AcronymService from '../../components/acronyms/AcronymService';
import AuthorService from '../../components/authors/AuthorService';

const acronyms = require('./acronym.json');

export default async function seedAcronyms() {
  try {
    const hasBeenSeeded = await AcronymService.findOne({
      key: Object.keys(acronyms[0])[0],
    });

    if (hasBeenSeeded) return;

    let admin = await AuthorService.findOne({
      email: 'author@admin.user',
    });

    if (!admin) {
      admin = await AuthorService.createOne({
        email: 'author@admin.user',
      });
    }

    const data = acronyms.map((acronym) => ({
      key: Object.keys(acronym)[0],
      value: Object.values(acronym)[0],
      author: admin.id,
    }));

    return await AcronymService.createMany(data);
  } catch (error) {
    console.log('Error seeding acronyms: ', error);
  }
}
