// src/services/localService.js

const API_URL = 'https://overpass-api.de/api/interpreter';

export async function cadastrarLocal(novoLocal) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(novoLocal),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao enviar o cadastro do local:', error);
    throw error;
  }
}