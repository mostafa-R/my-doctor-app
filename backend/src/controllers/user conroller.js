import bcrypt from "bcryptjs";
import models from "../models";
import JsonWebToken from "jsonwebtoken";

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    specialization,
    address,
    location,
    phone,
    workingHours,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    if (userType === "doctor") {
      const profile = await models.Profile.create({
        userId: user.id,
        specialization,
        address,
        workingHours,
        phone,
      });
    }

    res.status(200).json({ message: "تم انشاء حسابك بنجاح " });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "البريد الالكترونى او كلمه المرور غير صحيحين ",
      });
    }
    const authSuccess = await bcrypt.compare(password, user.password);

    if (authSuccess) {
      const token = JsonWebToken.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET
      );
      res.status(200).json({ accessToken: token });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};
export const me = (req, res) => {
  const user = req.currentUser;
  res.json(user);
};

export const getProfile = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: { id: req.currentUser.id },
      include: [{ model: models.Profile, as: "profile" }],
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};
