start_button=Запустить
back_button=Назад
cancel_button=Отмена
previous_button=Предыдущая
next_button=Следующая
empty_button=-
buy_button=Купить
order_link_button=Перейти
yes_button=Да
no_button=Нет
main_menu_button=Меню

action_canceled=Действие отменено!

# User buttons
subscriptions_list_button=Купить подписку
my_orders_button=Мои заказы
support_button=Помощь

# Admin buttons
control_panel_button=Панель управления
open_subscription_button=Подписка #{$subscriptionId}
create_subscription_button=Добавить товар
edit_subscription_button=Редактировать товары
edit_subscription_title_button=Название
edit_subscription_price_button=Цена
edit_subscription_duration_button=Срок действия
delete_subscription_button=Удалить
get_bot_transactions_report_button=Отчет

start_message=
  Привет, я такой-то бот
  Нажми на кнопку, чтобы продолжить
main_menu_message={$userlink}, нажми одну из кнопок, чтобы продолжить!

ask_user_email_message=
  {$userlink}, пришли мне свой E-Mail (Требуется для платежей)
invalid_user_email_message=
  {$userlink}, неверный E-Mail. Проверь его и пришли мне ещё раз!

  <code>{$date}</code>
email_saved_message=
  {$userlink}, E-Mail сохранен

no_subscriptions_message=Список доступных подписок пуст!
ask_subscription_title=
  Отправьте мне название подписки

  <code><i>{$date}</i></code>
ask_subscription_duration=
  Отправьте мне срок действия подписки (В днях)
  Ограничения:
  > Положительное число
  > Больше нуля
  У не целого числа будет отброшена лишняя часть!

  <code><i>{$date}</i></code>
ask_subscription_price=
  Отправьте мне цену подписки
  Ограничения:
  > Положительное число  
  > Больше 100 (Ограничение YooMoney)
  Числа с плавающей запятой разрешены

  <code><i>{$date}</i></code>
subscription_created_message=Подписка #{$subscriptionId} создана!
subscriptions_list_chunk={$index}. {$title}
subscriptions_list_message=
  Доступные для покупки подписки. 
  Страница: {$currentPage}/{$totalPages}

  {$subscriptionsList}
delete_subscription_message=
  {$userlink}, вы уверны, чтобы хотите удалить подписку (ID: {$subscriptionId})?
  
  Купленные подписку у пользователей остануться и будут работать!
subscription_deleted_message=Подписка #{$subscriptionId} удалена!
edit_subscription_message=
  ID: {$id}
  Название: <i>{$title}</i>

  Действует (Дней): <code>{$durationInDays}</code>
  Цена: <code>{$price}</code> RUB

  Добавлена: {$createdAt}
edit_subscription_title_message=Отправьте мне новое название подписки
edit_subscription_duration_message=
  Отправьте мне новый срок действия подписки (В днях)
  Ограничения:
  > Положительное число
  > Больше нуля
  У не целого числа будет отброшена лишняя часть!
edit_subscription_price_message=
  Отправьте мне новую цену подписки
  Ограничения:
  > Положительное число  
  > Больше 100 (Ограничение YooMoney)
  Числа с плавающей запятой разрешены
subscription_data_updated_message=Данные подписки успешно изменены!
subscription_not_found=Подписка не найдена! Вернитесь назад и попробуйте снова!

invoice_title=Подписка на сервис GlobeVPN
invoice_description=Количество дней: {$durationDays}
successful_invoice={$userlink}, вы успешно приобрели товар "{$productTitle}" за {$amount} {$currency}

order_buy_canceled_alert=Покупка товара отменена!
no_orders_message=У вас нет ни одного заказа.
orders_list_chunk={$index}. Заказ #{$orderId}
orders_list_message=
  Список приобретенных подписок. 
  Страница: {$currentPage}/{$totalPages}
  
  {$ordersList}
order_info=
  Номер заказа: <code>{$id}</code>
  Proxy пользователь: <code>{$username}</code>
  
  Дата начала: {$createdAt}
  Действует до: {$expireAt}
  
  Ссылка: {$link}
order_not_found=Заказ #{$orderId} не найден!
user_orders_not_found=У пользователя нет ни одного заказа!
user_orders_list=
  Заказы <a href="tg://user?id={$telegramId}">пользователя</a>.
  Страница: {$currentPage}/{$totalPages}

  {$userOrdersList} 
user_orders_list_chunk={$index}. <code>{$key}</code>
support_message=
  В случае возникновения проблем с покупкой, оплатой или приобретенным товаром обращаться: 
  Telegram: @zdev_tg
  Phone: +79999999999

control_panel_message={$userlink}, выбери одно из действий!
report_message=Отчёт по транзакциям пользователей