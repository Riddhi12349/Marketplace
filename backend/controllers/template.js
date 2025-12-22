const pool = require('../db');

const createTemplate = async (req, res) => {
  try {
    const { name, attributes } = req.body;

    const result = await pool.query(
      `INSERT INTO public."Templates" (name, attributes) 
       VALUES ($1, $2) 
       RETURNING id, name, attributes, created_at`,
      [name, JSON.stringify(attributes)]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


const listAllTemplate = async (req, res) => {

    try {
    const query = `
      SELECT * 
      FROM public."Templates"
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


const getTemplate = async (req , res)=>{

  const { id } = req.params;

try {
  const query = `
    SELECT *
    FROM public."Templates"
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [id]);

  res.status(200).json(rows[0]);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message });
}

    
};

const deleteTemplate = async (req,res)=>{
      
  try {
    const { id } = req.params;
    
    const { rows } = await pool.query(
      'DELETE FROM public."Templates" WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    createTemplate , listAllTemplate , getTemplate , deleteTemplate
}


