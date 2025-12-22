const pool = require('../db');

const saveMappings = async (req, res) => {
  try {
    const { fileName, templateName, mappingCount, productCount, mappings } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO public."Mappings"  (file_name, template_name, mapping_count, product_count, mappings) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fileName, templateName, mappingCount, productCount, JSON.stringify(mappings)]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllMappings = async (req, res) => {

   try {
    const { rows } = await pool.query(
      `SELECT *
       FROM public."Mappings" 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

};

const deleteMapping = async (req,res)=>{
      
  try {
    const { id } = req.params;
    
    const { rows } = await pool.query(
      'DELETE FROM public."Mappings" WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }
    
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    saveMappings , getAllMappings , deleteMapping
};