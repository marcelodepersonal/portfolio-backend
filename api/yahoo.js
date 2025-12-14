// Backend para Portfolio Manager
// Esta función evita problemas de CORS

export default async function handler(req, res) {
    // Permitir que tu HTML acceda a esta función
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Si es OPTIONS request (preflight), responder OK
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Obtener la URL que el HTML quiere consultar
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
        console.log('Fetching:', decodeURIComponent(url));
        
        // Este servidor hace el pedido a Yahoo Finance
        const response = await fetch(decodeURIComponent(url), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            console.error('Yahoo Finance error:', response.status);
            return res.status(response.status).json({ 
                error: `Yahoo Finance returned ${response.status}` 
            });
        }
        
        const data = await response.json();
        
        // Responder al HTML con los datos
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ 
            error: error.message 
        });
    }
}
