import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import "../../../css/login.css"
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="">
                <h1 className="login-header">Добре дошли</h1>

                <div className="back-link">
                        <Link href="/" className="text-link">
                            върни се в началото
                        </Link>
                    </div>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="login-form">
                    <div className="form-group">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="input-field"
                            autoComplete="username"
                            isFocused={true}
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
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="error-message" />
                    </div>

                    <div className="form-group remember-me">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Запомни ме
                            </span>
                        </label>
                    </div>

                    <div className="form-footer">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="forgot-password-link"
                            >
                                Забравена парола?
                            </Link>
                        )}

                        <PrimaryButton className="login-button" disabled={processing}>
                            Вход
                        </PrimaryButton>
                    </div>

                </form>
            </div>
            
        </GuestLayout>
    );
}
