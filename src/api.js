const BASE = 'https://genai-images-4ea9c0ca90c8.herokuapp.com';

async function postJson(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchP13nAnswers() {
  const body = {
    module_id: '1',
    parent_id: 'EXAMPLEPARENT',
    child_id: 'EXAMPLECHILD',
    responses: [
      {
        question_id: 'q006_tantrums',
        selected_choice_ids: ['choice_b', 'choice_c'],
        open_response_text: '',
        timestamp: new Date().toISOString(),
      },
      {
        question_id: 'q009_language_dev',
        selected_choice_ids: ['choice_c', 'choice_a'],
        open_response_text: '',
        timestamp: new Date().toISOString(),
      },
      {
        question_id: 'q008_development_concerns',
        selected_choice_ids: ['open_response'],
        open_response_text: 'His cognitive abilities being stunted by overuse of mobiles',
        timestamp: new Date().toISOString(),
      },
    ],
  };
  return postJson('/p13n_answers', body);
}

export function activateTinu({ child_id = 'EXAMPLECHILD', context = 'flash_card', module_id = '1', topic = 'nutrition_impacts_mood' } = {}) {
  const body = { child_id, context, module_id, topic };
  return postJson('/activate_tinu', body);
}

export function makeImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // some image_url values start with a leading slash - join with BASE
  return `${BASE}${path}`;
}

export default { fetchP13nAnswers, activateTinu, makeImageUrl, BASE };
