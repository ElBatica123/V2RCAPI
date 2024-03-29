const { ObjectId } = require("mongodb");
const { UserModel } = require("../../models/Users/users.models.js");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const { CreateAccess } = require("../../libs/jwt.js");
class User_Controller {
  Get(req, res, next) {
    UserModel.find({})
      .populate("roleRef")
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error al obtener el permiso" });
      })
      .finally(() => next());
  }

  // //__________________________________________________________________________________________

  async GetById(req, res, next) {
    const id = req.params.id;

    try {
      const result = await UserModel.find({
        _id: new ObjectId(id),
      }).populate("roleRef");

      res.status(200).send(result);
    } catch (error) {
      console.log("Error: " + error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    } finally {
      next();
    }
  }

  //__________________________________________________________________________________________

  async Post(req, res, next) {
    const { email, password, role, roleRef } = req.body;
    try {
      const passwordHash = await bycrypt.hash(password, 10);
      const result = new UserModel({
        email,
        password: passwordHash,
        role,
        roleRef,
      });
      const user = await result.save();

      if (!user) return res.status(400).send("hubo algún error");
      res.status(201).json({
        message: "GOOD",
        User: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    } finally {
      next();
    }
  }

  //__________________________________________________________________________________________

  async Put(req, res, next) {
    const id = req.params.id;

    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        req.body,
        { new: true }
      );
      if (result) {
        res.status(200).json({ message: "Permiso actualizado ", result });
      } else {
        res.status(500).json({ error: "Error al actualizar" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      next();
    }
  }

  //__________________________________________________________________________________________

  async Delete(req, res, next) {
    const id = req.params.id;

    try {
      const result = await UserModel.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (result) {
        res.status(200).send({ message: "Usuario borrado con éxito" });
      } else {
        res.status(404).send({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar el Usuario -> " + error.message);
      res
        .status(500)
        .send({ error: "Error interno del servidor", err: error.message });
    } finally {
      next();
    }
  }
  // LOGIN
  async Login(req, res, next) {
    const { password, email } = req.body;

    try {
      const Usuario = await UserModel.findOne({ email: email }).populate(
        "roleRef"
      );
      if (!Usuario) return res.status(404).send("El usuario no existe");

      const Coincide = await bycrypt.compare(password, Usuario.password);

      if (!Coincide) {
        return res
          .status(400)
          .json({ response: "La contraseña es incorrecta ", status: Coincide });
      }

      const Token = await CreateAccess({ id: Usuario._id });
      console.log(Token);
      res.cookie("token", Token, {
        sameSite: "none",
        secure: true,
      });
      res
        .status(200)
        .json({ message: "Bienvenido", result: Usuario, token: Token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Bad", error });
    } finally {
      next();
    }
  }
  Logout(req, res, next) {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).send("Sesión Cerrada");
    next();
  }
  async register(req, res, next) {
    const { password, email } = req.body;

    try {
      const passwordHash = await bycrypt.hash(password, 10);
      const newUser = await UserModel({
        email,
        password: passwordHash,
      });
      const UsuarioGuardado = await newUser.save();
      const Token = await CreateAccess({ id: UsuarioGuardado._id });
      console.log(Token);
      res.cookie("token", Token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      res.status(200).json({
        message: "Usuario Registrado",
        result: UsuarioGuardado,
        token: Token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Bad", error });
    } finally {
      next();
    }
  }
  async VerifyToken(req, res, next) {
    try {
      const { token } = req.cookies;
      console.log("Estamos verificando el token: " + token);
      if (!token) return res.status(400).json({ message: "Unauthorized" });

      const verify = await jwt.verify(token, process.env.SECRET_KEY);
      if (!verify) return res.status(400).json({ message: "Unauthorized" });

      const user = await UserModel.findById({ _id: new ObjectId(verify.id) });
      if (!user) return res.status(400).json({ message: "Unauthorized" });

      return res.status(200).json({
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Bad", error });
    } finally {
      next();
    }
  }
}
module.exports = { User_Controller };
