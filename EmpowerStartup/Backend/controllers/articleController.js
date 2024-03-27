const { Articles } = require("../models/db.schemas");

exports.addArticle = async (req, res) => {
  try {
    const { startupName, articleContent, articleImage } = req.body;
    const date = new Date();
    // Create a new article
    const article = new Articles({
      Date: date,
      startupName,
      articleImage,
      articleContent,
    });

    // Save the article to MongoDB
    await article.save();

    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllArcticles = async(req, res) =>  {
  try {
    const { pageSize, pageNumber , searchString} = req.body;
    const limit = parseInt(pageSize) || 10;
    const skip = parseInt(pageNumber) ? (parseInt(pageNumber) - 1) * limit : 0;
    const articles = await Articles.find()
    .skip(skip)
    .limit(limit);

  const totalCount = await Articles.countDocuments();
    res.json({
      articles,
      totalCount,
      pageSize: limit,
      pageNumber: parseInt(pageNumber) || 1,
    });

  } catch (error) {
     res.status(500).json({ message: error.message }); 
  }
}
