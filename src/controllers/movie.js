const { Prisma } = require("@prisma/client");
const prisma = require("../utils/prisma");

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany({
    include: {
      screenings: true,
    },
  });

  return res.status(200).json({ movies });
};

const createMovie = async (req, res) => {
  const { title, runtimeMins } = req.body;

  const existingMovie = await prisma.movie.findFirst({
    where: {
      title: title,
    },
  });

  if (existingMovie) {
    return res.status(400).json({ error: "Movie with the same title already exists" });
  } else {
    const movie = await prisma.movie.create({
      data: {
        title: title,
        runtimeMins: runtimeMins,
      },
      include: {
        screenings: true,
      },
    });

    return res.status(201).json({ movie });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;

  const foundMovie = await prisma.movie.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      screenings: true,
    },
  });
  return res.status(200).json({ movie: foundMovie });
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, runtimeMins } = req.body;

  const updatedMovie = await prisma.movie.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      runtimeMins,
    },
    include: {
      screenings: true,
    },
  });

  return res.status(201).json({ movie: updatedMovie });
};

module.exports = {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
};
