import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import classNames from 'classnames';

import { Button } from '../../../components/button';
import { CustomInput } from '../../../components/inputs/custom-input';
import { CustomMaskedInput } from '../../../components/inputs/masked-input';
import { PasswordInput } from '../../../components/inputs/password-input';
import { MASKS } from '../../../constants/masks';
import { REGEXP } from '../../../constants/regexp';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateUserRequest } from '../../../store/user';
import { getUserSelector } from '../../../store/user/selectors';
import { ResponseUser } from '../../../store/user/types';
import { validateEmail, validateLogin, validatePassword } from '../../../utils/validations';

import { BodyFormInputs, TableType } from './types';

import styles from './profile-body.module.scss';

type ProfileBodyProps = {
    user: ResponseUser;
};

export const ProfileBody = ({ user }: ProfileBodyProps) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const { isUpdateSuccess } = useAppSelector(getUserSelector);
    const dispatch = useAppDispatch();
    const TABLE: TableType[] = [
        {
            placeholder: 'Логин',
            name: 'login',
            data: user?.username,
            validation: validateLogin,
            hint: 'Используйте для логина латинский алфавит и цифры',
        },
        {
            type: 'password',
            placeholder: 'Пароль',
            name: 'password',
            data: '************',
            validation: validatePassword,
            hint: 'Пароль не менее 8 символов, с заглавной буквой и цифрой',
        },
        {
            placeholder: 'Имя',
            name: 'firstName',
            data: user?.firstName,
            validation: () => undefined,
        },
        {
            placeholder: 'Фамилия',
            name: 'lastName',
            data: user?.lastName,
            validation: () => undefined,
        },
        {
            type: 'tel',
            placeholder: 'Номер телефона',
            name: 'phone',
            data: user?.phone,
            validation: () => undefined,
            hint: 'В формате +375 (xx) xxx-xx-xx',
        },
        {
            type: 'email',
            placeholder: 'E-mail',
            name: 'email',
            data: user?.email,
            validation: validateEmail,
        },
    ];

    const methods = useForm<BodyFormInputs>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const { errors } = methods.formState;

    useEffect(() => {
        if (isUpdateSuccess) {
            setIsDisabled(true);
        }
    }, [isUpdateSuccess]);

    const handleSubmit = (data: BodyFormInputs) => {
        const { firstName, lastName, phone, login: username, password, email } = data;
        const { id } = user;

        dispatch(updateUserRequest({ id, username, password, email, firstName, lastName, phone }));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <div className={styles.title}>Учётные данные</div>
                <div className={styles.subtitle}>
                    Здесь вы можете отредактировать информацию о себе
                </div>
            </div>
            <FormProvider {...methods}>
                <form
                    className={styles.infoTable}
                    onSubmit={methods.handleSubmit(handleSubmit)}
                    data-test-id='profile-form'
                >
                    {TABLE.map(({ placeholder, data, name, type, hint, validation }) =>
                        name === 'password' ? (
                            <PasswordInput
                                dataTestId={`input-${name}`}
                                key={name}
                                name={name}
                                type={name}
                                placeholder={placeholder}
                                validate={validatePassword}
                                required={true}
                                error={errors[name as keyof BodyFormInputs]?.message}
                                isDisabled={isDisabled}
                            />
                        ) : name === 'phone' ? (
                            <CustomMaskedInput
                                mask={MASKS.phoneBy}
                                key={name}
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                validationPattern={{
                                    value: REGEXP.phoneNumber,
                                    message: hint || '',
                                }}
                                error={errors[name]?.message}
                                required={false}
                                hint={hint}
                                inputMode='tel'
                                // clearActionErrors={clearErrors}
                                autoComplete='off'
                                isDisabled={isDisabled}
                                defaultValue={data}
                                notAuthFilled={true}
                            />
                        ) : (
                            <CustomInput
                                dataTestId={`input-${name}`}
                                key={name}
                                type={type}
                                notAuthFilled={true}
                                name={name}
                                placeholder={placeholder}
                                validate={validation}
                                required={name === 'login' || name === 'email'}
                                defaultValue={data}
                                isDisabled={isDisabled}
                                error={errors[name as keyof BodyFormInputs]?.message}
                                hint={hint}
                                autoComplete='off'
                            />
                        ),
                    )}

                    <div className={styles.buttons}>
                        <Button
                            dataTestId='edit-button'
                            view='secondary'
                            classButton={classNames(styles.edit, styles.button)}
                            onClick={() => setIsDisabled(!isDisabled)}
                        >
                            Редактировать
                        </Button>
                        <Button
                            dataTestId='save-button'
                            view='primary'
                            type='submit'
                            classButton={classNames(styles.save, styles.button)}
                            isDisabled={isDisabled}
                        >
                            Сохранить изменения
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
