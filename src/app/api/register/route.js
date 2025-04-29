import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Отсутствующие поля' }), { status: 400 });
  }

  try {
    const checkResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Пользователь с таким email уже существует' }),
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [name, email, password_hash]
    );

    return new Response(JSON.stringify({ message: 'Зарегистрирован' }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Ошибка сервера' }), 
      { status: 500 }
    );
  }
}