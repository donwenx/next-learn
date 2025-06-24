'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formDate: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formDate.get('customerId'),
    amount: formDate.get('amount'),
    status: formDate.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices'); // 更新数据库后，将重新验证 /dashboard/invoices 路径，并从服务器获取新数据。
  redirect('/dashboard/invoices'); // 重定向回 /dashboard/invoices 页面。
}