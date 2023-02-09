export const SaveUser = (req, res) => {
  req.checkBody("name").notEmpty().withMessage("الاسم مطلوب");

  req.checkBody("email").notEmpty().withMessage("البريد الالكترونى مطلوب");

  req.checkBody("password").notEmpty().withMessage("كلمه المرور مطلوب");

  req.checkBody("userType").notEmpty().withMessage("نوع المستحدم مطلوب");
};
