import {
  useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'
import {
  type GameSettings,
  InputMode,
  GameMode,
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'
import { gameFormSchema } from '@/app/validations/game.schemas'
import { MIN_NUMBER_OF_OPTIONS, MAX_NUMBER_OF_OPTIONS } from '@/app/constants/game.constants'

export interface GameFormProps {
  onSubmit: (data: GameSettings) => void
  defaultValues: GameSettings
}

const GameForm = ({
  onSubmit,
  defaultValues = defaultInitState.settings,
}: GameFormProps) => {
  const form = useForm<GameSettings>({
    defaultValues: {
      ...defaultInitState.settings,
      ...defaultValues,
    },
    resolver: zodResolver(gameFormSchema),
    mode: 'onChange'
  })

  const gameMode = form.watch('gameMode')
  const languageMode = form.watch('languageMode')

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-thai-gold/20 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-thai-red">Create New Game</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Thai Alphabet Types */}
            <FormField
              control={form.control}
              name="thaiAlphabetTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Select Alphabet Types
                  </FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {Object.values(ThaiAlphabetType).map((type) => {
                      const isChecked = field.value.includes(type)
                      return (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newValue = checked 
                                ? [...field.value, type]
                                : field.value.filter((item) => item !== type)
                              field.onChange(newValue)
                            }}
                          />
                          <Label htmlFor={type} className="text-base">
                            <Badge variant="outline" className="cursor-pointer">
                              {type}
                            </Badge>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Game Type */}
            <FormField
              control={form.control}
              name="gameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Game Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-thai-gold/30">
                        <SelectValue placeholder="Select game type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alphabet">Alphabet</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Mode */}
            <FormField
              control={form.control}
              name="languageMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Language Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-thai-gold/30">
                        <SelectValue placeholder="Select language mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Mode - only for English language mode */}
            {languageMode === 'english' && (
              <FormField
                control={form.control}
                name="inputMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value === InputMode.Input}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? InputMode.Input : InputMode.Options)
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">
                        Free Text Input Mode
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Game Mode */}
            <FormField
              control={form.control}
              name="gameMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Game Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-thai-gold/30">
                        <SelectValue placeholder="Select game mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sequence">Sequence</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Options - only for Random mode */}
            {gameMode === GameMode.Random && (
              <FormField
                control={form.control}
                name="numberOfOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-foreground">Number of Options</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger className="border-thai-gold/30">
                          <SelectValue placeholder="Select number of options" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(
                          { length: MAX_NUMBER_OF_OPTIONS - MIN_NUMBER_OF_OPTIONS + 1 },
                          (_, i) => {
                            const value = MIN_NUMBER_OF_OPTIONS + i
                            return (
                              <SelectItem key={value} value={String(value)}>
                                {value}
                              </SelectItem>
                            )
                          }
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Game Level */}
            <FormField
              control={form.control}
              name="gameLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Game Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-thai-gold/30">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                size="lg"
                className="px-12 py-6 bg-thai-red hover:bg-thai-red/90 text-white text-2xl font-bold shadow-xl"
              >
                Start Game
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default GameForm