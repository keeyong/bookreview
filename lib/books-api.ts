import { supabase } from './supabase'
import { Book } from './types'

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Book[]
}

export async function fetchBook(id: string): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Book | null
}

export async function createBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
  const { data, error } = await supabase.from('books').insert(book).select().single()
  if (error) throw error
  return data as Book
}

export async function updateBook(
  id: string,
  book: Omit<Book, 'id' | 'created_at'>
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update(book)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Book
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}
