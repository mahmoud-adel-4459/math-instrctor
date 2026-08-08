import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary Exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center font-cairo">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/30 max-w-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black">حدث خطأ غير متوقع!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              تأسف لهذا الخطأ. تم تسجيل المشكلة وسيقوم فريق التطوير بمعالجتها في أقرب وقت.
            </p>

            <Button variant="primary" icon={RefreshCw} onClick={this.handleReset} className="mx-auto">
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
