import { Router } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const router = Router();

// 할일 목록 조회 (최신순)
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 할일 하나 조회
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: '올바르지 않은 할일 ID입니다' });
    }
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: '할일을 찾을 수 없습니다' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 할일 생성
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create({ title: req.body.title });
    res.status(201).json(todo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.errors.title?.message || err.message });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 할일 수정 (title, completed 중 보낸 항목만 변경)
router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: '올바르지 않은 할일 ID입니다' });
    }
    const { title, completed } = req.body ?? {};
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'completed는 true 또는 false여야 합니다' });
      }
      updates.completed = completed;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: '수정할 내용(title 또는 completed)을 보내주세요' });
    }
    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ message: '할일을 찾을 수 없습니다' });
    }
    res.json(todo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.errors.title?.message || err.message });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 할일 삭제
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: '올바르지 않은 할일 ID입니다' });
    }
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: '할일을 찾을 수 없습니다' });
    }
    res.json({ message: '할일이 삭제되었습니다', todo });
  } catch (err) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

export default router;
