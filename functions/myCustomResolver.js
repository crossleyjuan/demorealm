

exports = async function moviesByYear(year) {
  const cluster = context.services.get("Demo");
  const movies = cluster.db("sample_mflix").collection("movies");
  console.log(year);
  const year_movies = await movies
    .aggregate([
      { $match: { year: { $gt: year } } }
    ]);
  return year_movies.next();
};
