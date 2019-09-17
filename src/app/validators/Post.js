import * as Yup from 'yup';

class PostValidations {
  async index(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      content: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    return this;
  }
}

export default new PostValidations();
