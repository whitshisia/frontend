// api.js

const server_url = 'http://localhost:5000'; 
export const editBook = async (id, editedBook) => {
  try {
    const response = await fetch(`${server_url}/update_book/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedBook),
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    throw new Error(`Error updating book: ${error.message}`);
  }
};
