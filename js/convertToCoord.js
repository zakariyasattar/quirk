const api_key = 'bca4a1e1e7114d60801851d509542378';

export async function convertZipToCoord(zip) {
  const api_url = 'https://api.opencagedata.com/geocode/v1/json';

  const request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(zip)
    + '&pretty=1'
    + '&no_annotations=1';

  try {
    const response = await fetch(request_url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    if (data.results.length === 0) {
      throw new Error('No results found for the given zip code');
    }
    const coordinates = data.results[0].geometry;
    return coordinates;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
