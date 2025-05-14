import Joi from 'joi';
import { getValidated } from '../../src/utils/data-validation';
import { ApiError } from '../../src/model/api-error';

test('getValidated should strip unknown properties', async () => {
    //Arrange
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    }).required();

    const object = {
        id: '123',
        name: 'John Doe',
        age: 42,
    };

    const options = {
        stripUnknown: true,
    };

    //Act
    const validatedObject = await getValidated(schema, object, options);

    //Assert
    expect(validatedObject).toStrictEqual({
        id: '123',
        name: 'John Doe',
    });
});

test('getValidated should not strip unknown properties if schema allows unknown', async () => {
    //Arrange
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    })
        .unknown()
        .required();

    const object = {
        id: '123',
        name: 'John Doe',
        age: 42,
    };

    const options = {
        stripUnknown: true,
    };

    //Act
    const validatedObject = await getValidated(schema, object, options);

    //Assert
    expect(validatedObject).toStrictEqual({
        id: '123',
        name: 'John Doe',
        age: 42,
    });
});

test('getValidated should throw if object is undefined and schema is required', async () => {
    //Arrange
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    }).required();

    const object = undefined;

    const options = {
        stripUnknown: true,
    };

    //Act
    const validatedObject = getValidated(schema, object, options);

    //Assert
    await expect(Promise.resolve(validatedObject)).rejects.toThrow(ApiError);
});
