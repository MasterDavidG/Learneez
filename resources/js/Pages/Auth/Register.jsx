import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import "../../../css/login.css"; // Use the same login styles
import "../../../css/Welcome.css";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student', // Default role set to student
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="">
                <h1 className="login-header">Регистрация</h1>

                <div className="back-link">
                    <Link href="/" className="text-link">
                        върни се в началото
                    </Link>
                </div>

                <form onSubmit={submit} className="login-form">
                    <div className="form-group">
                        <InputLabel htmlFor="name" value="Име" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="input-field"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <InputError message={errors.name} className="error-message" />
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="input-field"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="error-message" />
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="password" value="Парола" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="error-message" />
                    </div>

                    <div className="form-group">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Потвърди Парола"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="error-message"
                        />
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="role" value="Роля" />

                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="input-field"
                        >
                            <option value="student">Ученик</option>
                            <option value="teacher">Учител</option>
                        </select>

                        <InputError message={errors.role} className="error-message" />
                    </div>

                    <div className="form-footer">
                        <Link
                            href={route('login')}
                            className="forgot-password-link"
                        >
                            Вече имате акаунт?
                        </Link>

                        <PrimaryButton className="login-button" disabled={processing}>
                            Регистрация
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
