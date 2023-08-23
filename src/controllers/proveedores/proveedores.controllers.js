const { ObjectId } = require("mongodb");
const { ProveedoresModels } = require("../../models/Proveedores/provedores.models");


class ProveedoresController {
  getProveedores(req,res, next) {
    ProveedoresModels.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al obtener Proveedores" });
    })
    .finally(() => next());
  }

  //_____________________________________________________________________________________

  async getProveedorPorId(req, res, next) {
    const id = req.params.id;

    try {
      const result = await ProveedorModels.find({
        _id: new ObjectId(id),
      });

      res.status(200).send(result);
    } catch (error) {
      console.log("Error: " + error);
    } finally {
      next();
    }
  }

    //_____________________________________________________________________________________

  async postProveedor(req, res) {
    const { Nombre, Apellido, Telefono, Email, Direccion } = req.body;
    const collection = "proveedor";
    try {
      const result = await ProveedoresModels.insertOne({
        Nombre: Nombre,
        Apellido: Apellido,
        Telefono: Telefono,
        Email: Email,
        Direccion: Direccion
      });

      if (result) {
        res.status(200).json({ message: "Documento creado exitosamente" });
      } else {
        res.status(500).json({ error: "Error al crear el documento" });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    } finally {
      db.close();
    }
  }


//_____________________________________________________________________________________

  async putProveedor(req, res, next) {
    const { Nombre, Apellido, Telefono, Email, Direccion } = req.body;
    const id = req.params.id;
    const collection = "proveedor";
    try {
      const result = await ProveedoresModels.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            Nombre: Nombre,
            Apellido: Apellido,
            Telefono: Telefono,
            Email: Email,
            Direccion: Direccion
          }
        }
      );
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Documento actualizado exitosamente" });
      } else {
        res.status(500).json({ error: "Error al actualizar el documento" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      db.close();
    }
  }

    //_____________________________________________________________________________________

  async deleteProveedor(req, res, next) {
    const id = req.params.id;
    const collection = "proveedor";
    try {
      const result = await ProveedoresModels.deleteOne({ _id: new ObjectId(id) });

      if (result) {
        res.status(200).send({ message: "Borrado con éxito" });
      } else {
        res.status(500).send({ error: "Error al eliminar el archivo" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      db.close();
    }
  }
}

module.exports = {
  ProveedoresController
};
