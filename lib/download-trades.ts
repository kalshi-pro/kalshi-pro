export const downloadTrades = async () => {
  try {
    const csv = await fetch('/api/download-trades', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    if (!csv.ok) {
      console.error(`Failed to fetch data: ${csv.statusText}`);
      throw new Error(`Failed to fetch data: ${csv.statusText}`);
    }
    const text = await csv.json();
    const csvData = new Blob([text.csv], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.setAttribute('download', `kalshi-trades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch trades: ' + error);
  }
};
