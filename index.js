import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRouter from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo';

app.use(cors());
app.use(express.json());
app.use('/todos', todoRouter);

app.get('/', (req, res) => {
  res.send('Todo backend is running');
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('연결 성공');
    app.listen(PORT, (err) => {
      if (err) {
        console.error(`서버 실행 실패: ${err.message}`);
        process.exit(1);
      }
      console.log(`서버가 ${PORT}번 포트에서 실행 중입니다`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  });
