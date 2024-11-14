'use client';

import { useState, useEffect } from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

// トーストの最大数
const TOAST_LIMIT = 1;
// トーストの削除遅延時間
const TOAST_REMOVE_DELAY = 1000000;

// トーストの型
type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};

// トーストのアクションタイプ
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

// トーストのIDカウンター
let count = 0;

// トーストのID生成
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

// トーストのアクションタイプ
type ActionType = typeof actionTypes;

// トーストのアクション
type Action =
    | {
          type: ActionType['ADD_TOAST'];
          toast: ToasterToast;
      }
    | {
          type: ActionType['UPDATE_TOAST'];
          toast: Partial<ToasterToast>;
      }
    | {
          type: ActionType['DISMISS_TOAST'];
          toastId?: ToasterToast['id'];
      }
    | {
          type: ActionType['REMOVE_TOAST'];
          toastId?: ToasterToast['id'];
      };

// トーストの状態
interface State {
    toasts: ToasterToast[];
}

// トーストのタイムアウト
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// トーストの削除キューに追加
const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

// トーストのリデューサー
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t,
                ),
            };

        case 'DISMISS_TOAST': {
            const { toastId } = action;

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                              ...t,
                              open: false,
                          }
                        : t,
                ),
            };
        }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
    }
};

// トーストのリスナー
const listeners: Array<(state: State) => void> = [];

// トーストのメモリー状態
let memoryState: State = { toasts: [] };

// トーストのディスパッチ
function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

// トーストの型
type Toast = Omit<ToasterToast, 'id'>;

// トーストの生成
function toast({ ...props }: Toast) {
    // トーストのID
    const id = genId();
    // トーストの更新
    const update = (props: ToasterToast) =>
        dispatch({
            type: 'UPDATE_TOAST',
            toast: { ...props, id },
        });
    // トーストの削除
    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

    // トーストの追加
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return {
        id: id,
        dismiss,
        update,
    };
}

// トーストのフック
function useToast() {
    // トーストの状態
    const [state, setState] = useState<State>(memoryState);

    // リスナーの追加
    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    };
}

export { useToast, toast };
