import sys
import time
import timeit

import tabulate

import python_class.python_class as python_class
import cython_class.cython_class as cython_class
import pure_cython_class.pure_cython_class as pure_cython_class
import cpp_class.cpp_class_wrapper as cpp_class_wrapper


# --------
LIST_NUMBER = 99999999  # 99,999,999
LIST_SIZE = 3000000  # 3,000,000
TEST_COUNT = 5

# --------
def cons_print(*args, end='\n'):
    sys.stdout.write(''.join(args) + end)
    sys.stdout.flush()

# ----
def run_benchmark(module):
    t_start = time.perf_counter()
    test_class = module.ExampleClass(LIST_NUMBER, LIST_SIZE)
    t_end = time.perf_counter()
    initialize_time = t_end - t_start
    
    sum_loop_time = min(timeit.Timer(test_class.sum_loop).repeat(TEST_COUNT, 1))
    res1 = test_class.sum_loop()
    
    sum_builtin_time = min(timeit.Timer(test_class.sum_builtin).repeat(TEST_COUNT, 1))
    res2 = test_class.sum_builtin()
    
    return initialize_time, sum_builtin_time, sum_loop_time, res1, res2

# --------
if __name__ == '__main__':
    cons_print(f'Running benchmarks... (Summing {LIST_SIZE:,} instances of {LIST_NUMBER:,})\n')
    py_init, py_sum_builtin, py_sum_loop, py_builtin_result, py_loop_result = run_benchmark(python_class)
    cy_init, cy_sum_builtin, cy_sum_loop, cy_builtin_result, cy_loop_result = run_benchmark(cython_class)
    cy_vec_init, cy_vec_sum_builtin, cy_vec_sum_loop, cy_vec_builtin_result, cy_vec_loop_result = run_benchmark(pure_cython_class)
    cy_wrapper_init, cy_wrapper_sum_builtin, cy_wrapper_sum_loop, cy_wrapper_builtin_result, cy_wrapper_loop_result = run_benchmark(cpp_class_wrapper)

    # Ensure all method calls returned the same value
    assert py_builtin_result == cy_builtin_result == py_loop_result == cy_loop_result == cy_vec_loop_result == cy_wrapper_loop_result
    
    cons_print(tabulate.tabulate([
            ['__init__', f'{py_init:.4f}s', f'{cy_init:.4f}s', f'{cy_vec_init:.4f}s', f'{cy_wrapper_init:.4f}s'],
            ['sum_loop', f'{py_sum_loop:.4f}s', f'{cy_sum_loop:.4f}s', f'{cy_vec_sum_loop:.4f}s', f'{cy_wrapper_sum_loop:.4f}s'],
            ['py_sum_builtin', f'{py_sum_builtin:.4f}s', f'{cy_sum_builtin:.4f}s', f'{cy_vec_sum_builtin:.4f}s', f'{cy_wrapper_sum_builtin:.4f}s']
        ],
        ['Function', 'Python', 'Cython', 'Cython C++ Vector', 'Cython C++ Class Wrapper'] 
    ))
    
    cons_print()
