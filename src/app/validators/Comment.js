import * as Yup from 'yup';

class CommentValidations {
  async index(req, res) {
    const schema = Yup.object().shape({
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

export default new CommentValidations();
