import { RequestHandler } from "express";
import { singupSchema } from "../schemas/singup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { singinSchema } from "../schemas/singin";

export const singup: RequestHandler = async (req, res) => {
  try {
    const safeData = singupSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }

    let genSlug = true;
    let userSlug = slug(safeData.data.name);
    while (genSlug) {
      const hasSlug = await findUserBySlug(userSlug);
      if (!hasSlug) {
        genSlug = false; // Slug único encontrado
      } else {
        userSlug = `${slug(safeData.data.name)}-${Math.floor(
          Math.random() * 1000
        )}`;
      }
    }

    const hashPassword = await hash(safeData.data.password, 10);

    const newUser = await createUser({
      name: safeData.data.name,
      email: safeData.data.email,
      password: hashPassword,
      slug: userSlug,
    });

    const token = createJWT(newUser.slug);

    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        slug: newUser.slug,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const singin: RequestHandler = async (req, res) => {
  try {
    const safeData = singinSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }
    const user = await findUserByEmail(safeData.data.email);
    if (!user) {
      res.status(401).json({ error: "Usuário ou senha incorretos" });
      return;
    }

    const verifyPass = await compare(safeData.data.password, user.password);
    if (!verifyPass) {
      res.status(401).json({ error: "Usuário ou senha incorretos" });
      return;
    }
    const token = createJWT(user.slug);

    res.status(200).json({
      token,
      user: {
        name: user.name,
        slug: user.slug,
        avatar: user.avatar,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
