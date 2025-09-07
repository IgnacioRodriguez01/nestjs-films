import { connect, disconnect, Schema, model } from 'mongoose';

async function seed() {
  await connect('mongodb://root:root@localhost:27017/films_dev?authSource=admin');

  const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'USER' },
  });

  const UserModel = model('User', UserSchema);

  const exists = await UserModel.findOne({ _id: '68bd54332ebac59ed5ca155f' });
  if (!exists) {
    await UserModel.create({
      _id: '68bd54332ebac59ed5ca155f',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '$2b$10$tvt3RAho272c4BlbPB/hme4NoU063F5NQLmCH0A0FEl0PW2Ujs616',
      role: 'ADMIN',
    });
    console.log('Usuario admin creado');
  } else {
    console.log('Usuario ya existe');
  }

  await disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
