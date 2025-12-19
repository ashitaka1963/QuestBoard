import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CloseIcon } from './Icons';
import '../styles/AuthModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('確認メールを送信しました。メールを確認して登録を完了してください。');
            }
            onClose();
        } catch (err: any) {
            setError(err.message || '認証に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-modal modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isLogin ? '冒険者ログイン' : '新規冒険者登録'}</h2>
                    <button className="close-btn" onClick={onClose} aria-label="閉じる">
                        <CloseIcon size={20} />
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>メールアドレス</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="primary-button" disabled={isLoading}>
                        {isLoading ? '処理中...' : (isLogin ? 'ログイン' : 'サインアップ')}
                    </button>
                </form>

                <div className="auth-switch">
                    {isLogin ? 'アカウントがない場合は：' : '既にアカウントがある場合は：'}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-button">
                        {isLogin ? '新規登録' : 'ログイン'}
                    </button>
                </div>
            </div>
        </div>
    );
};
