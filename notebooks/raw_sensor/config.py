DATA_FOLDER = '../../DataCollection/raw_sensor/'
# DATA_FILES = {
#     'idle': 'Custom Data - 2022-07-07 - Suhas_Raw_Values_Mode_0x03_fifo_0x6f.csv',
#     'exercise': 'Custom Data - 2022-07-07 - Suhas_Raw_Values_Mode_0x03_fifo_0x6f_Exercise.csv',
#     'after_plank': 'Custom Data - 2022-07-07 - Suhas_Raw_Values_Mode_0x03_fifo_0x6f_AfterPlank.csv',
#     'metal': 'Custom Data - 2022-07-07 - Suhas_Raw_Values_Mode_0x03_fifo_0x6f_Metal.csv',
# }
DATA_FILES = {
    'idle': ['Custom Data - 2022-07-09 - 16-22 - Suhas.csv',
             'Custom Data - 2022-07-09 - 16-42 - Suhas.csv',
             'Custom Data - 2022-07-09 - 22-50 - Suhas.csv'],
    'after_plank': ['Custom Data - 2022-07-09 - 19-28 Suhas.csv'],
    'weight': ['Custom Data - 2022-07-09 - 23-05 - Suhas.csv', 'Custom Data - 2022-07-10 - 12-48 - Suhas.csv'],
    'after_pushup': ['Custom Data - 2022-07-09 - 23-37 - Suhas.csv', 'Custom Data - 2022-07-10 - 15-30 - Suhas.csv'],
    'classical_music': ['Custom Data - 2022-07-09 - 18-29 - Suhas.csv', 'Custom Data - 2022-07-10 - 12-20 - Suhas.csv'],
}
DEFAULT_SAMPLING_RATE = 25
RESAMPLED_RATE = 100
BANDPASS = [0.7, 3.5]
